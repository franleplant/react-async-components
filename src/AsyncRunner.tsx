import React, { useEffect, useState } from "react";

interface IContext {
  refresh: () => any;
}

// This let's the user imperatively refresh a call
export const Context = React.createContext<IContext>({
  refresh: () => console.log("this isn't working"),
});

interface IProps<TChildProps> {
  children: (props: TChildProps) => Promise<React.ReactElement>;
  childProps: TChildProps;
  fallback?: () => React.ReactElement;
  renderError?: (err: any) => React.ReactElement;
}

// TODO display name, it would be nice to display AsyncRunner(AsyncComponent)
// but also it would be nice to to need to switch to class based components
export function AsyncRunner<TChildProps = void>(
  props: IProps<TChildProps> & { forceRun: number }
): React.ReactElement | null {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [element, setElement] = useState<React.ReactElement | null>(null);

  const { childProps, children, forceRun } = props;

  useEffect(() => {
    async function run() {
      setLoading(true);
      setError(null);
      setElement(null);
      try {
        console.log("async rendering");
        const element = await children(childProps);
        setElement(element);
        console.log("async rendering done");
      } catch (err) {
        console.log("async rendering error", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [childProps, children, forceRun]);

  if (loading && props.fallback) {
    return props.fallback();
  }

  if (error && props.renderError) {
    return props.renderError(error);
  }

  return element;
}

export default function AsyncRunnerContainer<TChildProps = void>(
  props: IProps<TChildProps>
): React.ReactElement | null {
  const [forceRun, setForceRun] = useState(0);

  Context.displayName = props.children.name;

  return (
    <Context.Provider
      value={{
        refresh: () => {
          console.log("refreshing");
          setForceRun((prev) => prev + 1);
        },
      }}
    >
      <AsyncRunner {...props} forceRun={forceRun} />
    </Context.Provider>
  );
}
