/**
 * Extracts the username part of an email address
 * @param {string} email - The full email address
 * @returns {string} The username portion of the email
 */

export const getUsernameFromEmail = (email) => {
    if (!email) return 'Anonymous';
    
    // Extract the part before the @ symbol
    const username = email.split('@')[0];
    
    return username;
  };