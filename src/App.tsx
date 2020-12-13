import React, { useEffect, useState } from "react";

export default function App() {
  const [userId, setUserId] = useState("fran");
  return (
    <div>
      <div className="card">
        <button onClick={() => setUserId((userId) => userId + "x")}>
          fetch other user
        </button>
        <div>
          <AsyncContainer childProps={{ userId }} fallback={() => <Loading />}>
            {AsyncComponent}
          </AsyncContainer>
        </div>
      </div>

      <div className="card">
        <AsyncContainer
          childProps
          fallback={() => <Loading />}
          renderError={(err) => <span>ERROR {err}</span>}
        >
          {AsyncComponentWithError}
        </AsyncContainer>
      </div>
    </div>
  );
}

interface IContainerProps<TChildProps> {
  children: (props: TChildProps) => Promise<React.ReactElement>;
  childProps: TChildProps;
  fallback?: () => React.ReactElement;
  renderError?: (err: any) => React.ReactElement;
}

export function AsyncContainer<TChildProps = void>(
  props: IContainerProps<TChildProps>
): React.ReactElement | null {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [element, setElement] = useState<React.ReactElement | null>(null);

  const { childProps, children } = props;

  useEffect(() => {
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const element = await children(childProps);
        setElement(element);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [childProps, children]);

  if (loading && props.fallback) {
    return props.fallback();
  }

  if (error && props.renderError) {
    return props.renderError(error);
  }

  return element;
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
