import {Link} from "react-router";
import {v4} from "uuid";
import {useAuth} from "../../hooks/useAuth.tsx";

function Start() {
  const { user } = useAuth();

  return (
    <div>
      <p>Hello {user.name}</p>
      <p>TODO: Select time frame</p>
      <button>
        <Link to={`/chat/${v4()}`}>Go to chat</Link>
      </button>
    </div>
  );
}

export default Start;