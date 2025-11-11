export const protect = async (req, res, next) => {
  try {
    
    const authData = (typeof req.auth === 'function') ? await req.auth() : (req.auth || {});

    const userId = authData?.userId || authData?.user_id || authData?.sub;

    console.log('Auth data (protect):', authData);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

   
    req.userId = userId;
    next();
  } catch (error) {
    console.error('Protect middleware error:', error);
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }
};

export default protect;