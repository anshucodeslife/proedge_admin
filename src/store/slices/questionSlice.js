import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    { id: 1, question: 'What is the value of Pi?', type: 'MCQ', subject: 'Mathematics', difficulty: 'Easy' },
    { id: 2, question: 'Explain Newton\'s Second Law.', type: 'Descriptive', subject: 'Physics', difficulty: 'Medium' },
  ],
};

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    addQuestion: (state, action) => {
      state.list.push({ ...action.payload, id: state.list.length + 1 });
    },
  },
});

export const { addQuestion } = questionSlice.actions;
export default questionSlice.reducer;
