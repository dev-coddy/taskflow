import mongoose from 'mongoose';

const dailyUpdateSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'Blocked'],
      required: [true, 'Status is required']
    },
    remarks: {
      type: String,
      required: [true, 'Remarks are required'],
      trim: true
    },
    hoursWorked: {
      type: Number,
      default: 0,
      min: 0,
      max: 24
    }
  },
  {
    timestamps: true
  }
);

const DailyUpdate = mongoose.model('DailyUpdate', dailyUpdateSchema);
export default DailyUpdate;
