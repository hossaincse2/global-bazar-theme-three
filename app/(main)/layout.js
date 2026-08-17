import FloatingIcons from '../_components/FloatingIcons';
import Footer from '../_components/Footer';
import Header from '../_components/Header';

const MainLayout = async ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingIcons />
        </div>
    );
};

export default MainLayout;
