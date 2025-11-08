// middleware/auth.js
export const protect = async (req, res, next) => {
  try {
    // Support both the function form (req.auth()) and the object form (req.auth)
    const authData = (typeof req.auth === 'function') ? await req.auth() : (req.auth || {});

    // Clerk sometimes uses userId, user_id, or sub
    const userId = authData?.userId || authData?.user_id || authData?.sub;

    console.log('Auth data (protect):', authData); // TEMP: useful for debugging — remove in prod

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // normalize for controllers
    req.userId = userId;
    next();
  } catch (error) {
    console.error('Protect middleware error:', error);
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }
};

export default protect;