import React, { useState, useContext } from "react";
import type { IUser } from "./api";
import * as api from "./api";
import AsyncRunner, { Context } from "../AsyncRunner";

export default function CompleteExample() {
  const [userId, setUserId] = useState(101);

  return (
    <div>
      <select
        onChange={(e) => {
          setUserId(Number(e.target.value));
        }}
        value={userId}
      >
        <option value={101}>Luffy</option>
        <option value={102}>Zoro</option>
        <option value={303}>Black Beard</option>
      </select>

      <div>
        <AsyncRunner
          childProps={{ userId }}
          fallback={() => <div>Loading...</div>}
          renderError={(err) => <div>Error {JSON.stringify(err)}</div>}
        >
          {User}
        </AsyncRunner>
      </div>
    </div>
  );
}

export interface IProps {
  userId: number;
}

export async function User(props: IProps): Promise<React.ReactElement> {
  const user = await api.getUser(props.userId);
  // You cannot call hooks inside async components unfortunately,
  // but you can on their children

  return (
    <div className="card user">
      <div>
        <img src={user.picture} alt={user.lastname} />
      </div>

      <Form user={user} />
    </div>
  );
}

export interface IForm {
  user: IUser;
}

export function Form(props: IForm) {
  const apiContext = useContext(Context);
  const [user, setUser] = useState(props.user);

  return (
    <form
      className="user-fields"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("saving");
        api.setUser(user);
        // tell AsyncRunner that we want to refetch the
        // http call
        apiContext.refresh();
      }}
    >
      <div className="field">
        <label htmlFor="firstname">First Name</label>
        <input
          id="firstname"
          value={user.firstname}
          onChange={(e) =>
            setUser((user) => ({ ...user, firstname: e.target.value }))
          }
        />
      </div>
      <div className="field">
        <label htmlFor="lasttname">Last Name</label>
        <input
          id="lastname"
          value={user.lastname}
          onChange={(e) =>
            setUser((user) => ({ ...user, lastname: e.target.value }))
          }
        />
      </div>

      <div className="field">
        <button type="submit">Save</button>
      </div>
    </form>
  );
}
