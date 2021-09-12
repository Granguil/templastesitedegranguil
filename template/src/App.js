import React, { useEffect, useState } from "react";
import { resource } from "resource";
import { connexionSearch } from "connexion";
import { NavigationBrowser } from "navigation";
import {
  fetchData,
  dataToGet,
  methodType,
  dataToSend,
  type,
} from "fetchhelper";
import "navigation/dist/index.css";
import "header/dist/index.css";
import "card/dist/index.css";
import "toaster/dist/index.css";
import "button/dist/index.css";
import "explorer/dist/index.css";
import Home from "./Home";

function App() {
  const [load, loader] = useState(false);
  const [contentNavigation, setContentNavigation] = useState({
    pseudo: null,
    role: null,
    site: null,
  });
  const resourceRequest = () => {
    fetchData(
      "Resources/" + process.env.REACT_APP_SITE_NAME + "/" + resource.lang,
      methodType.Get,
      null,
      {
        ...dataToGet,
        type: type.json,
        callback: (data) => {
          console.log(data);
          resource.load(data);
          console.log(resource.list);
          loader(true);
        },
      },
      true,
      false
    );
  };

  const condition = (dataConnexion) => {
    return (
      dataConnexion.pseudo !== "nc" &&
      dataConnexion.role !== "00000000-0000-0000-0000-000000000000"
    );
  };
  const success = (dataConnexion, data) => {
    data.connected = true;
    data.pseudo = dataConnexion.pseudo;
    data.role = dataConnexion.role;
    data.token = dataConnexion.token;
    resource.lang = dataConnexion.language;
    fetchData(
      "Role/GetType?idrole=" + data.role,
      methodType.Get,
      null,
      {
        ...dataToGet,
        callback: (response) => {
          data.typeRole = response;
          resourceRequest(resource);
        },
        type: type.json,
      },
      true,
      false
    );
    setContentNavigation({
      ...{
        pseudo: data.pseudo,
        role: data.role,
        site: process.env.REACT_APP_SITE_NAME,
      },
    });
    console.log(contentNavigation);
    //loader(true);
  };
  const fail = () => {
    window.location = "http://109.12.248.169:8080/Connexion/";
  };

  const connectRequest = (callback) => {
    const toget = { ...dataToGet, callback: callback };
    fetchData("PseudoSession", methodType.Get, null, toget, false, true);
  };
  const connect = () => {
    connexionSearch(connectRequest, condition, success, fail);
  };
  const [reload, setReload] = useState(false);
  useEffect(() => {
    connect();
  }, []);

  return (
    <NavigationBrowser>
      {load ? <Home contentNavigation={contentNavigation} /> : null}
    </NavigationBrowser>
  );
}

export default App;
