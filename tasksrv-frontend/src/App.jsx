import { Route, Routes } from "react-router-dom"
import HomePage from "./Pages/HomePage"
import LoginPage from "./Pages/LoginPage"
import ProtectedPage from "./Pages/ProtectedPage"


function App() {
  

  return (
    <>
     <Routes>
      
       <Route path="/" element={ <LoginPage/>}/>
       <Route path="/protected" element={ <ProtectedPage/>}/>
     </Routes>
     
    
    </>
  )
}

export default App
