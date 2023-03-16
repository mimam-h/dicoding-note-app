/* eslint-disable new-cap */
/* eslint-disable import/no-extraneous-dependencies */
const { nanoid } = require('nanoid');
const notes = require('./notes');

// Add New Notes
const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Note berhasil ditambahkan',
            data: {
                noteId: id
            }
        });
        response.header('Access-Control-Allow-Origin', '*');
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Note gagal ditambahkan',
    });
    response.header('Access-Control-Allow-Origin', '*');
    response.code(500);
    return response;
};

// Show All Notes
const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

// Get Note Detail
const getNoteById = (request, h) => {
    const { id } = request.params;
    const note = notes.filter((n) => n.id === id)[0];
    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
};

// Edit Note
const editNoteById = (request, h) => {
    const { id } = request.params;
    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = notes.findIndex((n) => n.id === id);
    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
          });
          response.code(200);
          return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui. Catatan tidak ditemukan'
    });
    response.code(404);
    return response;
};

// Delete Note
const deleteNoteById = (request, h) => {
    const { id } = request.params;
    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Note berhasil dihapus'
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Note gagal dihapus. Note tidak ditemukan!'
    });
    response.code(404);
    return response;
};

module.exports = {
    addNoteHandler, getAllNotesHandler, getNoteById, editNoteById, deleteNoteById
};