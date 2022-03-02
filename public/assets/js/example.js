// Get references to page elements
const $exampleText = $('#example-text');
const $exampleDescription = $('#example-description');
const $submitBtn = $('#submit');
const $exampleList = $('#example-list');
const $emojiValue = $('#emoji');

const editText = document.getElementById('editText');
const editDescription = document.getElementById('editDescription');
const editEmoji = document.getElementById('editEmoji');


// The API object contains methods for each kind of request we'll make
const API = {
  saveExample: function (example) {
    return $.ajax({
      headers: {
        'Content-Type': 'application/json'
      },
      type: 'POST',
      url: 'api/examples',
      data: JSON.stringify(example)
    });
  },
  getExamples: function () {
    return $.ajax({
      url: 'api/examples',
      type: 'GET'
    });
  },
  editDream: function (id) {
    return $.ajax({
      url: 'api/example/' + id,
      type: 'PUT',

      data: {
        "text":editText.innerHTML, 
        "description":editDescription.innerHTML,
        "emoji":editEmoji.innerHTML,
      }
    });
  }, 
  deleteExample: function (id) {
    return $.ajax({
      url: 'api/examples/' + id,
      type: 'DELETE'
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
const refreshExamples = function () {
  API.getExamples().then(function (data) {
    const $examples = data.map(function (example) {
      var createdAttime = moment.utc(example.createdAt).format("MM/DD/YYYY");
      const $a = $('<a class="pastjournalentrymarker">')
        .text(createdAttime + " " + example.text + " " +  example.emoji)

        .attr('href', '/example/' + example.id);

      const $li = $('<li>')
        .attr({
          class: 'list-group-item',
          'data-id': example.id
        })
        .append($a);
      // delete button
      const $deletebutton = $('<button>')
        .addClass('btn btn-dark float-right delete')
        .html('<i class="fa-solid fa-trash-can"></i>');
      $li.append($deletebutton);

    //   // expand button
    //   const $expandbutton = $('<a>')
    //   .html('<i class="fa-solid fa-expand"></i>')
    //   .attr({
    //     class: 'btn btn-dark text-white pastjournalentrymarker float-right',
    //     "href": '/example/' + example.id});
    // $li.append($expandbutton);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
const handleFormSubmit = function (event) {
  event.preventDefault();

  const example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim(),
    emoji: $emojiValue.val().trim(),
    UserId: window.userId
  };

  if (!(example.text && example.description)) {
    alert('You must enter an example text and description!');
    return;
  }

  API.saveExample(example).then(function () {
    refreshExamples();
  });

  $exampleText.val('');
  $exampleDescription.val('');
  $emojiValue.val('');
};

const handleEditBtnClick = function () {
  const idToEdit = $(this).parent().attr('data-id');

  API.editDream(idToEdit).then(function () {
    refreshExamples();
  });
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
const handleDeleteBtnClick = function () {
  const idToDelete = $(this).parent().attr('data-id');

  API.deleteExample(idToDelete).then(function () {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on('click', handleFormSubmit);
$exampleList.on('click', '.editDream', handleEditBtnClick);
$exampleList.on('click', '.delete', handleDeleteBtnClick);
