import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../Firebase";
import firebase from "firebase";

const AuthContext = React.createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [disableStatus, setdisableStatus] = useState(false);
  
  
  const [loading, setloading] = useState(true);
  let adminStatus = "normal";

  function signup(email, password, username) {
    console.log("i am here");
    console.log(email);
    console.log(password);
    return auth.createUserWithEmailAndPassword(email, password).then((cred) => {
      console.log("i am initiated 🔥  ");
      console.log(cred.user.uid);
      db.collection("admin-users").doc(cred.user.uid).set({
        UserName: username,
        Useremail: email,
        AdminStatus: adminStatus,
        Disable: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    });
  }
  

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
     
    }
    
  

  function logout() {
    return auth.signOut();
  }
  function ResetPass(email) {
    return auth.sendPasswordResetEmail(email);
  }

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setloading(false);
    });
    return unsub;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    ResetPass,
    disableStatus,
    loading,
  
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
