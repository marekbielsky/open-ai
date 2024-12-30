import {Link} from "react-router";
import {v4} from "uuid";

function Start() {
  return (
    <div>
      <p>TODO: Select time frame</p>
      <button>
        <Link to={`/chat/${v4()}`}>Go to chat</Link>
      </button>
    </div>
  );
}

export default Start;