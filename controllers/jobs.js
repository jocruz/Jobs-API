const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError("No Job was Found");
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobsId },
  } = req;

  if (!company || !position) {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }

  //In summary, setting new: true and runValidators: true in the options object passed to
  // findByIdAndUpdate ensures that the updated version of the document is returned
  //and that the update operation is validated against the schema before it is executed.
  const job = await Job.findByIdAndUpdate(
    { _id: jobsId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError("No Job was Found");
  }

  res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
  const {
    user: userId,
    params: { id: jobId },
  } = req;
  const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: userId },);

  if (!job) {
    throw new NotFoundError(`No Job with jobId ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
