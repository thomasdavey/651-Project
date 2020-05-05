import React from 'react';
import axios from 'axios';
import './App.css';

function App() {
  React.useEffect(() => {
    get();
  }, []);

  const [noteTitle, setNoteTitle] = React.useState('');
  const [note, setNote] = React.useState('');
  const [notes, setNotes] = React.useState([]);
  const [editState, setEditState] = React.useState('');

  const get = () => {
    axios.get('/get')
      .then((res) => {
        setNotes(res.data);
      })
      .catch(console.log);
  }

  const submit = () => {
    const body = {
      noteTitle,
      note,
    }
    axios.post('/submit', body)
      .then((res) => {
        console.log(res);
        get();
        cancel();
      })
      .catch(console.log);
  }

  const edit = (note) => {
    setEditState(note._id);
    setNoteTitle(note.title);
    setNote(note.note);
  }

  const cancel = () => {
    setEditState('');
    setNoteTitle('');
    setNote('');
  }

  const update = () => {
    const body = {
      id: editState,
      noteTitle,
      note,
    }
    axios.post('/update', body)
      .then((res) => {
        console.log(res);
        get();
        cancel();
      })
      .catch(console.log);
  }

  const remove = () => {
    const body = {
      id: editState,
    }
    axios.post('/remove', body)
      .then((res) => {
        console.log(res);
        get();
        cancel();
      })
      .catch(console.log);
  }

  let render =
    <div>
      <div className="section">
        <input
          placeholder="Note Title"
          value={noteTitle}
          onChange={e => setNoteTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Enter Note Here..."
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <br />
        <button onClick={submit}>Submit</button>
      </div>
      <div className="section notes">
        {notes.map((note, i) =>
          <div key={i} className="note-container">
            <div className="note">
              <h3>{note.title}</h3>
              <p>{note.note}</p>
              <button onClick={() => edit(note)}>Edit</button>
            </div>
          </div>
        )}
      </div>
    </div>

  if (editState !== '') {
    render =
      <div className="section">
        <input
          placeholder="Note Title"
          value={noteTitle}
          onChange={e => setNoteTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Enter Note Here..."
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <br />
        <button onClick={cancel}>Cancel</button>
        <button onClick={update}>Update</button>
        <button className="delete" onClick={remove}>Delete</button>
      </div>
  }

  return (
    <div className="App">
      <nav>
        <h1>Notes App</h1>
      </nav>
      {render}
    </div>
  );
}

export default App;
