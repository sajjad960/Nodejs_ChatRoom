import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import Chat from './components/chat/Chat';
import Home from './components/home/Home';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
function App() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const token = localStorage.getItem('jwt');

    if(!token) {
      return ''
    }
    const verifyUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/verifyuser', {
          method: 'GET',
          credentials: 'same-origin',
          // body: JSON.stringify({token}),
          headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`}
        });
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.log(error)
      }


    }
    verifyUser()


  }, [])
  return (
    <Router>
      <div className="App">
        <UserContext.Provider value={{ user, setUser }}>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/chat/:room_id/:room_name" component={Chat} />
            <Route path='/login' component={Login}/>
            <Route path='/signup' component={Signup}/>

          </Switch>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
