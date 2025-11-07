const API_BASE_URL = 'https://notes-api.dicoding.dev/v2';

class NotesAPI {
  static async getNotes() {
    try {
      const response = await fetch(`${API_BASE_URL}/notes`);
      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  }

  static async getArchivedNotes() {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/archived`);
      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson.data;
    } catch (error) {
      console.error('Error fetching archived notes:', error);
      throw error;
    }
  }

  static async getSingleNote(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`);
      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson.data;
    } catch (error) {
      console.error('Error fetching single note:', error);
      throw error;
    }
  }

  static async createNote({ title, body }) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body }),
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson.data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  /**
   * Update note by deleting old and creating new one
   * This is a workaround because Dicoding API doesn't have PUT endpoint
   * @param {string} id - Note ID to update
   * @param {Object} data - Note data with title and body
   * @param {boolean} wasArchived - Whether the note was archived before update
   * @returns {Promise<Object>} The newly created note
   */
  static async updateNote(id, { title, body }, wasArchived = false) {
    try {
      // Delete the old note
      await this.deleteNote(id);
      
      // Create new note with updated data
      const newNote = await this.createNote({ title, body });
      
      // If the note was archived, archive the new one
      if (wasArchived) {
        await this.archiveNote(newNote.id);
        // Fetch the note again to get the archived status
        return await this.getSingleNote(newNote.id);
      }
      
      return newNote;
    } catch (error) {
      console.error('Error updating note (delete + create):', error);
      throw error;
    }
  }

  static async deleteNote(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'DELETE',
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson.message;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  static async archiveNote(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}/archive`, {
        method: 'POST',
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson.message;
    } catch (error) {
      console.error('Error archiving note:', error);
      throw error;
    }
  }

  static async unarchiveNote(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}/unarchive`, {
        method: 'POST',
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson.message;
    } catch (error) {
      console.error('Error unarchiving note:', error);
      throw error;
    }
  }
}

export default NotesAPI;
