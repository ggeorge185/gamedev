import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import '../styles/Vocabulary.css'

function Vocabulary() {
  const { setId } = useParams()
  const [vocabulary, setVocabulary] = useState([])
  const [currentSet, setCurrentSet] = useState(null)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [newWord, setNewWord] = useState({
    word_de: '',
    word_en: '',
    phonetic_de: '',
    word_type: '',
    clue_1: '',
    clue_2: '',
    set_id: setId
  })
  const [csvError, setCsvError] = useState('')

  const wordTypes = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'other']

  useEffect(() => {
    fetchSetDetails()
    fetchVocabulary()
  }, [setId])

  function fetchSetDetails() {
    axios.get(`/api/vocabulary-sets/${setId}`)
      .then(res => setCurrentSet(res.data))
      .catch(err => setError(err.message))
  }

  function fetchVocabulary() {
    axios.get(`/api/vocabulary?set_id=${setId}`)
      .then(res => setVocabulary(res.data))
      .catch(err => setError(err.message))
  }

  function handleCreate(e) {
    e.preventDefault()
    axios.post('/api/vocabulary', newWord)
      .then(() => {
        fetchVocabulary()
        setNewWord({
          word_de: '',
          word_en: '',
          phonetic_de: '',
          word_type: '',
          clue_1: '',
          clue_2: '',
          set_id: setId
        })
      })
      .catch(err => setError(err.message))
  }

  function handleUpdate(id, updatedWord) {
    axios.put(`/api/vocabulary/${id}`, updatedWord)
      .then(() => {
        fetchVocabulary()
        setEditingId(null)
      })
      .catch(err => setError(err.message))
  }

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this word?')) {
      axios.delete(`/api/vocabulary/${id}`)
        .then(() => fetchVocabulary())
        .catch(err => setError(err.message))
    }
  }

  // Add this function to handle CSV upload
  function handleCSVUpload(e) {
    const file = e.target.files[0]
    const reader = new FileReader()
    
    reader.onload = async (event) => {
      try {
        const csv = event.target.result
        const lines = csv.split('\n')
        const headers = lines[0].split(',')
        
        // Update required headers (remove difficulty)
        const requiredHeaders = ['word_de', 'word_en', 'phonetic_de', 'word_type']
        if (!requiredHeaders.every(h => headers.includes(h))) {
          setCsvError('Invalid CSV format. Required columns: ' + requiredHeaders.join(', '))
          return
        }

        // Parse rows without difficulty
        const words = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',')
            return {
              word_de: values[0],
              word_en: values[1],
              phonetic_de: values[2],
              word_type: values[3],
              clue_1: values[4] || '',
              clue_2: values[5] || '',
              set_id: setId
            }
          })

        // Upload words in batches
        for (const word of words) {
          await axios.post('/api/vocabulary', word)
        }

        fetchVocabulary()
        setCsvError('')
      } catch (err) {
        setCsvError('Error importing CSV: ' + err.message)
      }
    }

    reader.onerror = () => {
      setCsvError('Error reading file')
    }

    reader.readAsText(file)
  }

  return (
    <div className="vocabulary">
      <h2>Vocabulary Management</h2>
      
      {/* Create new word form */}
      <form onSubmit={handleCreate} className="add-word-form">
        <h3>Add New Word</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>German Word</label>
            <input
              placeholder="Enter German word"
              value={newWord.word_de}
              onChange={e => setNewWord({...newWord, word_de: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>English Word</label>
            <input
              placeholder="Enter English word"
              value={newWord.word_en}
              onChange={e => setNewWord({...newWord, word_en: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Phonetic (German)</label>
            <input
              placeholder="Enter phonetic spelling"
              value={newWord.phonetic_de}
              onChange={e => setNewWord({...newWord, phonetic_de: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Clue 1</label>
            <input
              placeholder="Enter first clue"
              value={newWord.clue_1}
              onChange={e => setNewWord({...newWord, clue_1: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Clue 2</label>
            <input
              placeholder="Enter second clue"
              value={newWord.clue_2}
              onChange={e => setNewWord({...newWord, clue_2: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Word Type</label>
            <select
              value={newWord.word_type}
              onChange={e => setNewWord({...newWord, word_type: e.target.value})}
              required
            >
              <option value="">Select type</option>
              {wordTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit">Add Word</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {/* CSV Import Section */}
      <div className="csv-import">
        <h3>Import from CSV</h3>
        <div className="form-group">
          <label>Upload CSV File</label>
          <input 
            type="file" 
            accept=".csv"
            onChange={handleCSVUpload}
          />
          {csvError && <div className="error-message">{csvError}</div>}
        </div>
        <div className="csv-format">
          <p>Expected CSV format:</p>
          <pre>
            word_de,word_en,phonetic_de,word_type,clue_1,clue_2
            Haus,house,haʊs,noun,building where people live,has rooms
            gehen,to go,ˈgeːən,verb,movement,walking
          </pre>
        </div>
      </div>

      {/* Vocabulary list */}
      <div className="vocabulary-list">
        {vocabulary.map(word => (
          <div key={word.id} className="word-card">
            {editingId === word.id ? (
              <form onSubmit={e => {
                e.preventDefault()
                handleUpdate(word.id, {
                  word_de: e.target.word_de.value,
                  word_en: e.target.word_en.value,
                  phonetic_de: e.target.phonetic_de.value,
                  word_type: e.target.word_type.value,
                  clue_1: e.target.clue_1.value,
                  clue_2: e.target.clue_2.value
                })
              }}>
                <div className="form-grid">
                  <input name="word_de" defaultValue={word.word_de} required />
                  <input name="word_en" defaultValue={word.word_en} required />
                  <input name="phonetic_de" defaultValue={word.phonetic_de} />
                  <input name="clue_1" defaultValue={word.clue_1} />
                  <input name="clue_2" defaultValue={word.clue_2} />
                  <select name="word_type" defaultValue={word.word_type} required>
                    {wordTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="word-content">
                  <h3>{word.word_de}</h3>
                  <p><strong>English:</strong> {word.word_en}</p>
                  <p><strong>Phonetic:</strong> {word.phonetic_de}</p>
                  <p><strong>Type:</strong> {word.word_type}</p>
                  {word.clue_1 && <p><strong>Clue 1:</strong> {word.clue_1}</p>}
                  {word.clue_2 && <p><strong>Clue 2:</strong> {word.clue_2}</p>}
                </div>
                <div className="actions">
                  <button onClick={() => setEditingId(word.id)}>Edit</button>
                  <button onClick={() => handleDelete(word.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Vocabulary