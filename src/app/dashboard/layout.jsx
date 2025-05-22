 
import "../../app/globals.css";
import Sidebar from "../../components/Sidebar";
 import AuthProvider from "../../Provider/AuthProvider";


export default function RootLayout({ children }) {
  return (
    <div>
      <AuthProvider>
        <div className="flex ">
          <Sidebar />
          <main className="flex justify-center w-full">{children}</main>
        </div>
      </AuthProvider>
    </div>
  );
}