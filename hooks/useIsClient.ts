import { useEffect, useState } from 'react';

/**
 * A custom hook to determine if the code is running on the client side.
 *
 * @returns {boolean} True if running on the client side, false otherwise.
 */
const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // As useEffect runs only on the client, setting isClient to true inside it
    // guarantees that the rendering process is happening on the client side.
    setIsClient(true);
  }, []);

  return isClient;
};

export default useIsClient;
