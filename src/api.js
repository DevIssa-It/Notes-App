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

  static async updateNote(id, { title, body }) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'PUT',
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
      console.error('Error updating note:', error);
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
