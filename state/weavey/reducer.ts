import { createReducer } from '@reduxjs/toolkit';
import { WeaveyState } from '../types';
import { setWeaveyContent } from './actions';

export const initialState: WeaveyState = {
    title: 'Weavey Helper',
    content: 'This is Weavey Helper Content',
    isOpen: false
}

export default createReducer(initialState, (builder) =>
    builder
        .addCase(setWeaveyContent, (state: any, action: any) => {
            state.title = action.payload.title;
            state.content = action.payload.content;
            state.isOpen = action.payload.isOpen;
        })
)
