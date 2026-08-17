// import PosProvider from '@/_context/PosProductContext';

import { PosProvider } from '@/_context/PosProductContext';
import { PosUserProvider } from '@/_context/posUser';
import AuthProvider from '@/_provider/authProvider';

const PosLayout = ({ children }) => {
  return (
    <div>
      <AuthProvider>
        <PosUserProvider>
          <PosProvider>{children}</PosProvider>
        </PosUserProvider>
      </AuthProvider>
    </div>
  );
};

export default PosLayout;
