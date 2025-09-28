import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from "./pages/Register";
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import CommunautesPage from "./pages/CommunautesPage";
import CommunityDetail from "./components/community/CommunityDetail";
import SubCommunityDetail from './components/community/SubCommunityDetail';
// import InvitationForm from "./components/admin/InvitationForm";
// import InvitationList from "./components/admin/InvitationList";
import UserManager from "./components/admin/UserManager";
import InvitationManager from "./components/admin/InvitationManager";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                <Route path="/admin/dashboard" element={
                    <PrivateRoute admin>
                        <AdminDashboard />
                    </PrivateRoute>
                } />
                <Route path="/admin" element={ <PrivateRoute admin><AdminDashboard /></PrivateRoute>}>
                  <Route path="generate" element={<InvitationManager />} />
                  <Route path="users" element={<UserManager />} />
                  {/* <Route path="invitations" element={<InvitationList />} /> */}
                </Route>
                <Route path="/user/dashboard" element={
                    <PrivateRoute>
                        <UserDashboard />
                    </PrivateRoute>
                } />
                                {/* 📌 Nouvelle route Communautés */}
                <Route path="/communautes" element={<PrivateRoute><CommunautesPage /></PrivateRoute>} />
                <Route path="/communautes/:id" element={<PrivateRoute><CommunityDetail /></PrivateRoute>} />
                <Route path="/subcommunautes/:subId" element={<PrivateRoute><SubCommunityDetail /></PrivateRoute>} />
                
            </Routes>
        </BrowserRouter>
    );
}

export default App;
