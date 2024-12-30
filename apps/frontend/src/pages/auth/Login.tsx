import {useAuth} from "../../hooks/useAuth.tsx";
import {useState} from "react";
import './login.css';

function Login() {
  const { login } = useAuth();

  const companies = [
    'Strelka',
    'MOTO-MATE Ltd',
    'Relay Technologies',
    'Regno Cloud Limited',
    'Yordex',
    'clearBorder',
    'Prevayl',
    'Twyn Limited',
    'New Motion Labs',
    'Hit and Run Ltd',
    'Swerve',
    'evRiderz Ltd',
    'Valerian',
    'Just Move In',
    'Omnium - Myparceldelivery.com Ltd',
    'Shipergy Ltd',
    'Lounges.tv Ltd',
    'Ocushield',
    'Infranomics'
  ]

  const [company, setCompany] = useState("")

  async function handleLogin(e) {
    e.preventDefault();
    login(company);
  }


  return (
    <div className='login-form'>
      <form onSubmit={handleLogin}>
        <h2>Login to your account</h2>
        <div>
          <select onChange={e => {setCompany(e.target.value)}}>
            <option disabled selected>Select company</option>
            {companies.map((company) => (<option value={company} key={company}>{company}</option>))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Log in</button>
      </form>
    </div>
  );
}

export default Login;