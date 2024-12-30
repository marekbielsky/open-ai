import { Outlet } from 'react-router';

function Layout() {
  return (
    <>
      <div className="header">
        <img src="/logo-square.svg" alt="Connectd Logo" className="logo" />
        <h1>Connectd AI Update Tool</h1>
      </div>
      <Outlet />
    </>
  );
}

export default Layout;