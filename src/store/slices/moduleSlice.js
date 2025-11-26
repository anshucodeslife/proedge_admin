import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    { 
      id: 1, 
      courseId: 1, 
      title: 'Algebra Foundations', 
      order: 1,
      lessons: [
        { id: 1, title: 'Introduction to Variables', type: 'Video', durationSec: 600, order: 1, videoUrl: 's3://bucket/video1.mp4' },
        { id: 2, title: 'Linear Equations', type: 'Video', durationSec: 900, order: 2, videoUrl: 's3://bucket/video2.mp4' }
      ]
    },
    { 
      id: 2, 
      courseId: 1, 
      title: 'Geometry Basics', 
      order: 2,
      lessons: [
        { id: 3, title: 'Points and Lines', type: 'Video', durationSec: 720, order: 1, videoUrl: 's3://bucket/video3.mp4' }
      ]
    }
  ],
};

const moduleSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {
    addModule: (state, action) => {
      state.list.push({ ...action.payload, id: state.list.length + 1, lessons: [] });
    },
    addLesson: (state, action) => {
      const module = state.list.find(m => m.id === action.payload.moduleId);
      if (module) {
        module.lessons.push({ 
          ...action.payload.lesson, 
          id: Math.max(...module.lessons.map(l => l.id), 0) + 1 
        });
      }
    }
  },
});

export const { addModule, addLesson } = moduleSlice.actions;
export default moduleSlice.reducer;
