// src/validation/formValidation.js
import $ from 'jquery';
import 'jquery-validation';

export const addGroupValidation = (handleSubmitGroup) => {
  $('#addGroupForm').validate({
    rules: {
      groupName: {
        required: true,
        minlength: 3,
      },
      
    },
    messages: {
        groupName: {
        required: 'Groupname is required',
        minlength: 'Username must be at least 3 characters long',
      },
    },
    submitHandler: function (e) {
      e.preventDefault();
      // alert('Form is valid! Submitting...');
      handleSubmitGroup();
    },
  });
};
