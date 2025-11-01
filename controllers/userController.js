const User = require("../models/userModel");

exports.getUser = (req, res, next) => {
  try {
    return res.json({ success: true, user: req.user, message: "User fetched Successfully" })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "failed to get user"
    })
  }
}

exports.updateUser = async (req, res, next) => {
  const { username, phone, address } = req.body;
  try {
    const user = { ...req.user._doc };
    if (username) user.username = username;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    const updatedUser = await User.findByIdAndUpdate(user._id, user, { new: true, runValidators: true });
    const userObj = updatedUser.toObject();
    delete userObj.password;
    if (!updatedUser) return res.status(500).json({ success: false, message: "failed to update user" })

    return res.status(200).json({
      success: true,
      user: userObj,
      message: "Successfully Updated"
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "failed to update user"
    })
  }
}

exports.resetPassword = async (req, res, next) => {
  const { email, answer, newPassword } = req.body;

  try {
    if (!email || !answer || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "empty field"
      })
    }

    const user = await User.findOne({ email, answer });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or answer key"
      })
    }

    if (await user.verifyPassword(newPassword)) {
      // 402 unprocessable entity
      return res.status(422).json({
        success: false,
        message: "This is previous password, create new password"
      })
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully"
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password"
    })
  }
}