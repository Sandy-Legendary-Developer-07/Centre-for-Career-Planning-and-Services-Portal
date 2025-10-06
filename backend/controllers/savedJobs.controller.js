import SavedJob from "../models/savedJobs.model.js";
import JobPosting from "../models/jobPosting.model.js";

export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.userId;

    await SavedJob.create({ userId, jobId });
    return res.status(200).json({ message: "Job saved." });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(200).json({ message: "Already saved." });
    }
    console.error("Save job error:", err);
    return res.status(500).json({ message: "Failed to save job." });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const savedJobs = await SavedJob.find({ userId }).populate("jobId");
    console.log("Fetched saved applications:", savedJobs);
    res.json({ savedJobs });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.userId; // set by protectRoute

    // Check if job exists
    const job = await JobPosting.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Remove jobId from SavedJobs
    const updatedStudent = await Student.findOneAndUpdate(
      { user: userId },
      { $pull: { SavedJobs: jobId } },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found or not authorized." });
    }

    return res.status(200).json({
      message: "Job unsaved successfully.",
      savedJobs: updatedStudent.SavedJobs,
    });
  } catch (error) {
    console.error("Unsave job error:", error);
    return res.status(500).json({ message: "Failed to unsave job." });
  }
};
