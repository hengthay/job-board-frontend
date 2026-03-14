export const getTokenExpiry = (token) => {
  try {
    // header.payload.signature -> we select payload
    const base64Payload = token.split('.')[1];

    // Decode Base64 to readable JSON string
    const jsonString = atob(base64Payload);

    // parse JSON string to Javascrit Object.
    const payload = JSON.parse(jsonString);
    
    // Convert to ms
    return payload.exp * 1000;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const isTokenExpired = (token) => {
  const expiry = getTokenExpiry(token);

  if(!expiry) return true;

  return Date.now() >= expiry; // true if expired
}