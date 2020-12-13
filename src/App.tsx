import React, { useState } from "react";
import AsyncRunner from "./AsyncRunner";
import CompleteExample from "./CompleteExample";

export default function App() {
  const [userId, setUserId] = useState("fran");
  return (
    <div>
      {/*
      <div className="card">
        <button onClick={() => setUserId((userId) => userId + "x")}>
          fetch other user
        </button>
        <div>
          <AsyncRunner childProps={{ userId }} fallback={() => <Loading />}>
            {AsyncComponent}
          </AsyncRunner>
        </div>
      </div>

      <div className="card">
        <AsyncRunner
          childProps
          fallback={() => <Loading />}
          renderError={(err) => <span>ERROR {err}</span>}
        >
          {AsyncComponentWithError}
        </AsyncRunner>
      </div>
        */}

      <div className="cardnot">
        <CompleteExample />
      </div>
    </div>
  );
}

interface IProps {
  userId: string;
}

export async function AsyncComponent(
  props: IProps
): Promise<React.ReactElement> {
  const user = await getUser(props.userId);
  return (
    <div>
      fetched user
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

export async function AsyncComponentWithError(): Promise<React.ReactElement> {
  await new Promise((resolve, reject) =>
    setTimeout(() => reject("failed"), 1000)
  );
  return <div>should never render</div>;
}

export function Loading() {
  return <span>Loading...</span>;
}

const user = {
  birthday: "1988-11-01",
  github: "franleplant",
  twitter: "franleplant",
};

type IUser = typeof user;

export function getUser(userId: string): Promise<IUser> {
  return new Promise((resolve) => setTimeout(() => resolve(user), 1000));
}
