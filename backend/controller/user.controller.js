import AddUser from "../models/User.js";

// Add a new user to the details array
export const addUserDetail = async (req, res, next) => {
  try {
    const { userId, name, regno, rollno, department, year, email, number, password, roles, isAdmin } = req.body;

    // Validate input data
    if (!userId || !name || !regno || !rollno || !department || !year || !email || !number || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user by ID and update the details array
    const user = await AddUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add new user to the details array
    user.details.push({
      name,
      regno,
      rollno,
      department,
      year,
      email,
      number,
      password,
      roles,
      isAdmin,
    });

    await user.save();
    return res.status(201).json({ message: "User added successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error adding user", error });
  }
};

// Edit an existing user in the details array
export const editUserDetail = async (req, res, next) => {
  try {
    const { userId, userDetailId, updatedDetails } = req.body;

    // Find the user by ID
    const user = await AddUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the index of the user in the details array and update it
    const userIndex = user.details.findIndex(detail => detail._id.toString() === userDetailId);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User detail not found" });
    }

    // Update the user details (only specific fields are updated)
    user.details[userIndex] = { ...user.details[userIndex], ...updatedDetails };
    await user.save();

    return res.status(200).json({ message: "User details updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error updating user", error });
  }
};

// Delete a user from the details array
export const deleteUserDetail = async (req, res, next) => {
  try {
    const { userId, userDetailId } = req.body;

    // Find the user by ID
    const user = await AddUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the user from the details array
    const detailIndex = user.details.findIndex(detail => detail._id.toString() === userDetailId);
    if (detailIndex === -1) {
      return res.status(404).json({ message: "User detail not found" });
    }

    // Pull the user detail from the array
    user.details.pull({ _id: userDetailId });
    await user.save();

    return res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting user", error });
  }
};

// Get all user details from the database
export const getUsersdetails = async (req, res, next) => {
  try {
    // Fetch users from the database and select only the 'details' field
    const users = await AddUser.find().select('details');

    // Extract the 'details' array from each user and flatten the array
    const userDetails = users.map(user => user.details).flat();

    // Ensure that userDetails contains all the required fields and send the response
    return res.status(200).json({ users: userDetails });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching users", error });
  }
};
