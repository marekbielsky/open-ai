import {Link, Outlet} from 'react-router';
import {useAuth} from './hooks/useAuth.tsx';

function Layout() {
  const { user, logout } = useAuth();

  const sessionButton = user ? (
    <a href='#' onClick={logout}>Logout</a>
  ) : (
    <Link to="login">Login</Link>
  );


  return (
    <>
      <div className="header">
        <img src="/logo-square.svg" alt="Connectd Logo" className="logo" />
        <h1>Connectd AI Update Tool</h1>
        {sessionButton}
      </div>
      <Outlet />
    </>
  );
}

export default Layout;