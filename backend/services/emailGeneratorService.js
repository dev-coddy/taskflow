import DailyUpdate from '../models/DailyUpdate.js';
import User from '../models/User.js';

export const buildEODEmail = async ({ date, department, managerName }) => {
  const targetDate = date ? new Date(date) : new Date();
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Formatted Date String: e.g. "Tuesday, Aug 4, 2026"
  const formattedDateStr = targetDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Query daily updates for specified date
  let userQuery = { isActive: true };
  if (department && department !== 'All') {
    userQuery.department = department;
  }

  const users = await User.find(userQuery).select('_id name email department role');
  const userIds = users.map((u) => u._id);

  const updates = await DailyUpdate.find({
    date: { $gte: startOfDay, $lte: endOfDay },
    employeeId: { $in: userIds }
  })
    .populate('taskId', 'title priority status')
    .populate('employeeId', 'name department email');

  // Group updates by Employee Name
  const groupedUpdates = {};

  // Initialize entry for all employees so managers can easily see who submitted vs missed
  users.forEach((u) => {
    if (u.role === 'Employee') {
      groupedUpdates[u.name] = [];
    }
  });

  updates.forEach((update) => {
    const empName = update.employeeId?.name || 'Unknown Employee';
    if (!groupedUpdates[empName]) {
      groupedUpdates[empName] = [];
    }

    const taskTitle = update.taskId?.title || 'General Task';
    const statusText = update.status || 'In Progress';
    const hoursText = update.hoursWorked ? ` (${update.hoursWorked} hrs)` : '';
    const updateBullet = `• ${taskTitle} [${statusText}]: ${update.remarks}${hoursText}`;
    
    groupedUpdates[empName].push(updateBullet);
  });

  // Build Output Plaintext
  const deptName = department && department !== 'All' ? department : 'Engineering & QA';
  const mgrSignature = managerName || 'Management';

  let emailText = `Hi Team,\n\nToday's Status Updates - ${formattedDateStr}\n\n`;

  let updateCount = 0;
  Object.keys(groupedUpdates).sort().forEach((employeeName) => {
    const bullets = groupedUpdates[employeeName];
    emailText += `${employeeName}\n`;
    if (bullets.length === 0) {
      emailText += `• No updates logged for today\n`;
    } else {
      bullets.forEach((b) => {
        emailText += `${b}\n`;
        updateCount++;
      });
    }
    emailText += `\n`;
  });

  emailText += `Regards,\n${deptName} Team (${mgrSignature})`;

  return {
    emailText,
    date: formattedDateStr,
    totalUpdatesLogged: updateCount,
    employeeCount: Object.keys(groupedUpdates).length
  };
};
