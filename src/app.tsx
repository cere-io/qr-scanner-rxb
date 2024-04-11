import packageJson from '../package.json';
import {AppRouter} from './router';

export function App() {
  console.log(
    `%cClient App Version:  ${packageJson.version}`,
    ` color:white; background-color:black; border-left: 1px solid yellow; padding: 4px;`,
  );

  return (
    <>
      <AppRouter />
    </>
  );
}
