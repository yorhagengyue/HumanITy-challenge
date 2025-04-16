const db = require('../models');
const CalendarEvent = db.calendarEvents;
const CalendarCategory = db.calendarCategories;
const { Op } = db.Sequelize;

// Get all calendar events for a user
exports.getAllEvents = async (req, res) => {
  try {
    const userId = req.userId;
    const events = await CalendarEvent.findAll({
      where: { user_id: userId },
      include: [{
        model: CalendarCategory,
        as: 'category',
        attributes: ['id', 'name', 'color']
      }],
      order: [['start_time', 'ASC']]
    });
    
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching calendar events:', err);
    res.status(500).json({ message: 'Failed to fetch calendar events' });
  }
};

// Get events for a specific month
exports.getMonthEvents = async (req, res) => {
  try {
    const userId = req.userId;
    const { year, month } = req.params;
    
    // Validate year and month
    if (!year || !month || isNaN(Number(year)) || isNaN(Number(month))) {
      return res.status(400).json({ message: 'Invalid year or month parameters' });
    }
    
    // Set start and end dates for the month
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
    
    const events = await CalendarEvent.findAll({
      where: {
        user_id: userId,
        [Op.or]: [
          {
            start_time: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            end_time: {
              [Op.between]: [startDate, endDate]
            }
          }
        ]
      },
      include: [{
        model: CalendarCategory,
        as: 'category',
        attributes: ['id', 'name', 'color']
      }],
      order: [['start_time', 'ASC']]
    });
    
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching month events:', err);
    res.status(500).json({ message: 'Failed to fetch calendar events for the month' });
  }
};

// Get a single event
exports.getEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    
    const event = await CalendarEvent.findOne({
      where: {
        id,
        user_id: userId
      },
      include: [{
        model: CalendarCategory,
        as: 'category',
        attributes: ['id', 'name', 'color']
      }]
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Calendar event not found' });
    }
    
    res.status(200).json(event);
  } catch (err) {
    console.error('Error fetching calendar event:', err);
    res.status(500).json({ message: 'Failed to fetch calendar event' });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, location, start_time, end_time, all_day, category_id, reminder } = req.body;
    
    // Validate required fields
    if (!title || !start_time || !end_time) {
      return res.status(400).json({ message: 'Title, start time, and end time are required' });
    }
    
    // Validate category if provided
    if (category_id) {
      const categoryExists = await CalendarCategory.findOne({
        where: {
          id: category_id,
          user_id: userId
        }
      });
      
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid calendar category' });
      }
    }
    
    // Create the event
    const newEvent = await CalendarEvent.create({
      user_id: userId,
      title,
      description: description || '',
      location: location || '',
      start_time,
      end_time,
      all_day: all_day || false,
      category_id: category_id || null,
      reminder: reminder || null
    });
    
    // Return the created event with category info
    const createdEvent = await CalendarEvent.findByPk(newEvent.id, {
      include: [{
        model: CalendarCategory,
        as: 'category',
        attributes: ['id', 'name', 'color']
      }]
    });
    
    res.status(201).json({
      message: 'Calendar event created successfully',
      event: createdEvent
    });
  } catch (err) {
    console.error('Error creating calendar event:', err);
    res.status(500).json({ message: 'Failed to create calendar event' });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { title, description, location, start_time, end_time, all_day, category_id, reminder } = req.body;
    
    // Find the event
    const event = await CalendarEvent.findOne({
      where: {
        id,
        user_id: userId
      }
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Calendar event not found' });
    }
    
    // Validate category if provided
    if (category_id) {
      const categoryExists = await CalendarCategory.findOne({
        where: {
          id: category_id,
          user_id: userId
        }
      });
      
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid calendar category' });
      }
    }
    
    // Update the event
    await event.update({
      title: title || event.title,
      description: description !== undefined ? description : event.description,
      location: location !== undefined ? location : event.location,
      start_time: start_time || event.start_time,
      end_time: end_time || event.end_time,
      all_day: all_day !== undefined ? all_day : event.all_day,
      category_id: category_id !== undefined ? category_id : event.category_id,
      reminder: reminder !== undefined ? reminder : event.reminder,
      updated_at: new Date()
    });
    
    // Return the updated event with category info
    const updatedEvent = await CalendarEvent.findByPk(event.id, {
      include: [{
        model: CalendarCategory,
        as: 'category',
        attributes: ['id', 'name', 'color']
      }]
    });
    
    res.status(200).json({
      message: 'Calendar event updated successfully',
      event: updatedEvent
    });
  } catch (err) {
    console.error('Error updating calendar event:', err);
    res.status(500).json({ message: 'Failed to update calendar event' });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    
    // Find the event
    const event = await CalendarEvent.findOne({
      where: {
        id,
        user_id: userId
      }
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Calendar event not found' });
    }
    
    // Delete the event
    await event.destroy();
    
    res.status(200).json({ message: 'Calendar event deleted successfully' });
  } catch (err) {
    console.error('Error deleting calendar event:', err);
    res.status(500).json({ message: 'Failed to delete calendar event' });
  }
};

// Get all categories for a user
exports.getAllCategories = async (req, res) => {
  try {
    const userId = req.userId;
    
    const categories = await CalendarCategory.findAll({
      where: { user_id: userId },
      order: [['name', 'ASC']]
    });
    
    res.status(200).json(categories);
  } catch (err) {
    console.error('Error fetching calendar categories:', err);
    res.status(500).json({ message: 'Failed to fetch calendar categories' });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, color } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Create the category
    const newCategory = await CalendarCategory.create({
      user_id: userId,
      name,
      color: color || '#2196F3'
    });
    
    res.status(201).json({
      message: 'Calendar category created successfully',
      category: newCategory
    });
  } catch (err) {
    console.error('Error creating calendar category:', err);
    res.status(500).json({ message: 'Failed to create calendar category' });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { name, color } = req.body;
    
    // Find the category
    const category = await CalendarCategory.findOne({
      where: {
        id,
        user_id: userId
      }
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Calendar category not found' });
    }
    
    // Update the category
    await category.update({
      name: name || category.name,
      color: color || category.color,
      updated_at: new Date()
    });
    
    res.status(200).json({
      message: 'Calendar category updated successfully',
      category
    });
  } catch (err) {
    console.error('Error updating calendar category:', err);
    res.status(500).json({ message: 'Failed to update calendar category' });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    
    // Find the category
    const category = await CalendarCategory.findOne({
      where: {
        id,
        user_id: userId
      }
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Calendar category not found' });
    }
    
    // Check if there are any events using this category
    const eventCount = await CalendarEvent.count({
      where: {
        category_id: id
      }
    });
    
    if (eventCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category as it is being used by events. Please reassign or delete the events first.' 
      });
    }
    
    // Delete the category
    await category.destroy();
    
    res.status(200).json({ message: 'Calendar category deleted successfully' });
  } catch (err) {
    console.error('Error deleting calendar category:', err);
    res.status(500).json({ message: 'Failed to delete calendar category' });
  }
}; 