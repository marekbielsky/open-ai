import {Link} from "react-router";

function Home() {
  return (
    <div>
      <p>This is a testing tool for Connectd AI Update tool</p>
      <p>You are logged in as an example company called XXX</p>
      <button>
        <Link to="/chat">Start chat</Link>
      </button>
    </div>
  );
}

export default Home;