import React, { useState } from "react";
import { resource } from "resource";
import { dataConnect, CheckConnexion, roleTypeList } from "connexion";
import Header, { connectByDefault, titleByDefault } from "header";
import { NavigationDisplay } from "navigation";
import { cardByDefault, FormCard, SimpleCard } from "card";
import ToastersDisplay, {
  NewToaster,
  positionToaster,
  colorToaster,
} from "toaster";
import {
  fetchData,
  dataToGet,
  methodType,
  dataToSend,
  type,
} from "fetchhelper";
import { ButtonCustom, ButtonTypeList } from "button";
import style from "./style.module.css";
import { Explorer } from "explorer";

export default function Home({ contentNavigation }) {
  const [reload, setReload] = useState(false);
  const connectHeader = { ...connectByDefault };
  connectHeader.connected = dataConnect.connected;
  connectHeader.connected = dataConnect.pseudo;
  const titleCustom = {
    ...titleByDefault,
    title:
      resource.list !== undefined ? resource.list.title : "Site de Granguil",
    subtitle:
      resource.list !== undefined
        ? resource.list.subtitle
        : "Ecrits de Granguil",
  };
  const contactCustom = [];
  contactCustom.push(
    {
      type: "Text",
      text:
        resource.list !== undefined ? resource.list.contactTitle : "Contact",
    },
    {
      type: "Link",
      text: resource.list !== undefined ? resource.list.contactLink : "test",
      link:
        resource.list !== undefined
          ? resource.list.contactLink
          : "www.sitedegranguil.fr",
    },
    {
      type: "Link",
      text:
        resource.list !== undefined
          ? resource.list.contactMail
          : "sitedegranguil@gmail.com",
      link:
        resource.list !== undefined
          ? resource.list.contactMail
          : "sitedegranguil@gmail.com",
    }
  );
  const cardFormCustom = {
    ...cardByDefault,
    action: "/",
    method: "GET",
    submit: (e) => {
      e.preventDefault();
      console.log("Form Submit");
    },
  };
  const navigationRequest = (contentObj, callbackNav) => {
    const ds = { ...dataToSend, content: contentObj };
    console.log(contentObj);
    const dg = { ...dataToGet, callback: (data) => callbackNav(data) };
    fetchData("Navigation/Get", methodType.Post, ds, dg, true, false);
  };

  const loadExplorer = (callbackExplorer) => {
    fetchData(
      "/Read/All/" + dataConnect.pseudo,
      methodType.Get,
      null,
      { ...dataToGet, callback: (data) => callbackExplorer(data) },
      true,
      false
    );
  };
  const createBookMark = (data) => {
    console.log("bm : " + JSON.stringify(data));
    fetchData(
      "/Read/AddBookMark",
      methodType.Post,
      { ...dataToSend, content: data, type: type.json },
      {
        ...dataToGet,
        callback: (bool) => {
          bool ? alert("Success BM") : alert("Error BM");
        },
      },
      true,
      false
    );
  };
  const readValidated = (data) => {
    fetchData(
      "/Read/ReadByUser",
      methodType.Post,
      { ...dataToSend, content: data, type: type.json },
      {
        ...dataToGet,
        callback: (bool) => {
          bool
            ? NewToaster({
                title: "Success",
                position: positionToaster.left,
                color: colorToaster.success,
                text: "Scene marked as read",
              })
            : NewToaster({
                title: "Fail",
                position: positionToaster.left,
                color: colorToaster.error,
                text: "Fail to mark scene",
              });
        },
      },
      true,
      false
    );
  };
  const loadBookMark = (setBookMark) => {
    fetchData(
      "/Read/GetBookMarks/" + dataConnect.pseudo,
      methodType.Get,
      null,
      { ...dataToGet, callback: (data) => setBookMark(data) },
      true,
      false
    );
  };
  const deleteBookMark = (id) => {
    fetchData(
      "/Read/DeleteBookMark",
      methodType.Post,
      { ...dataToSend, content: { id }, type: type.json },
      {
        ...dataToGet,
        callback: () => {
          alert("Delete");
          NewToaster({
            title: "Delete",
            position: positionToaster.left,
            color: colorToaster.error,
            text: "BookMark Deleted",
          });
          setReload(false);
          console.log(reload);
        },
      },
      true,
      false
    );
  };
  const buttonsList = {
    createBM: (text, callback) => {
      return (
        <ButtonCustom
          text={text}
          callback={(data) => callback(data)}
          type={ButtonTypeList.create}
        ></ButtonCustom>
      );
    },
    updateBM: (text, callback) => {
      return (
        <ButtonCustom
          text={text}
          callback={(data) => callback(data)}
          type={ButtonTypeList.edit}
        ></ButtonCustom>
      );
    },
    deleteBM: (text, callback) => {
      return (
        <ButtonCustom
          text={text}
          callback={(data) => callback(data)}
          type={ButtonTypeList.deleteItem}
        ></ButtonCustom>
      );
    },
    readValidated: (text, callback) => {
      return (
        <ButtonCustom
          text={text}
          callback={(data) => callback(data)}
          type={ButtonTypeList.create}
        ></ButtonCustom>
      );
    },
  };
  return (
    <div>
      <Header
        contact={contactCustom}
        title={titleCustom}
        connect={connectHeader}
      />
      <NavigationDisplay
        fetchRequest={navigationRequest}
        contentObject={contentNavigation}
        resources={resource.list !== undefined ? resource.list.nav : {}}
      />
      <div className={style.body}>
        <ButtonCustom
          text="Submit"
          type={ButtonTypeList.create}
          callback={() => {
            NewToaster({
              title: "Création",
              position: positionToaster.left,
              color: colorToaster.info,
              text: "Création de l'élément",
            });
          }}
        />
        <ButtonCustom
          text="Get Secret"
          type={ButtonTypeList.edit}
          callback={() =>
            fetchData(
              "/Secret/Get/Test1",
              methodType.Get,
              null,
              {
                ...dataToGet,
                callback: (data) => console.log(data),
              },
              true,
              false
            )
          }
        />
      </div>
      <div className={style.body}>
        <FormCard card={cardFormCustom}>
          <h4>Submit</h4>
        </FormCard>
        <CheckConnexion bool={true} role={roleTypeList.MANAGER}>
          <SimpleCard>
            <h3>Simple Card</h3>
          </SimpleCard>
        </CheckConnexion>
        <CheckConnexion bool={true} role={roleTypeList.USER}>
          <SimpleCard>
            <h1>Error if it's displaying !</h1>
          </SimpleCard>
        </CheckConnexion>
      </div>
      <Explorer
        load={(f) => loadExplorer(f)}
        userId={dataConnect.pseudo}
        createBookMark={(data) => createBookMark(data)}
        loadBookMark={(data) => loadBookMark(data)}
        deleteBookMark={(id) => deleteBookMark(id)}
        buttonsList={buttonsList}
        readValidated={(data) => readValidated(data)}
        resources={resource.list !== undefined ? resource.list.explorer : {}}
      />
      <ToastersDisplay />
    </div>
  );
}
