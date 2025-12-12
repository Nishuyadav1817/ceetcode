import { useState, useEffect } from 'react';
import axiosClient from './axiosClient';



const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
     const response= await axiosClient.get(`/problem/submithistory/${problemId}`);
        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch submission history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'badge-success';
      case 'wrong': return 'badge-error';
      case 'error': return 'badge-warning';
      case 'pending': return 'badge-info';
      default: return 'badge-neutral';
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };
const SubmissionHistory = ({
  loading,
  error,
  submissions,
  selectedSubmission,
  setSelectedSubmission,
  getStatusColor,
  formatMemory,
  formatDate,
}) => {
  if (loading) {
    return (
      <div className="loading-container">
        <span className="loading-spinner"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <div className="alert-content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 
              9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="title">Submission History</h2>

      {submissions.length === 0 ? (
        <div className="alert alert-info">
          <div className="alert-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856
                c1.54 0 2.502-1.667 1.732-3L13.732 4
                c-.77-1.333-2.694-1.333-3.464 0L3.34 16
                c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>No submissions found for this problem</span>
          </div>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="submission-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Runtime</th>
                  <th>Memory</th>
                  <th>Test Cases</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, index) => (
                  <tr key={sub._id}>
                    <td>{index + 1}</td>
                    <td className="mono">{sub.language}</td>
                    <td>
                      <span className={`badge ${getStatusColor(sub.status)}`}>
                        {sub.status.charAt(0).toUpperCase() +
                          sub.status.slice(1)}
                      </span>
                    </td>
                    <td className="mono">{sub.runtime}sec</td>
                    <td className="mono">{formatMemory(sub.memory)}</td>
                    <td className="mono">
                      {sub.testCasesPassed}/{sub.testCasesTotal}
                    </td>
                    <td>{formatDate(sub.createdAt)}</td>
                    <td>
                      <button
                        className="btn-outline"
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="summary-text">
            Showing {submissions.length} submissions
          </p>
        </>
      )}

      {selectedSubmission && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="modal-title">
              Submission Details: {selectedSubmission.language}
            </h3>

            <div className="modal-details">
              <div className="badge-group">
                <span
                  className={`badge ${getStatusColor(
                    selectedSubmission.status
                  )}`}
                >
                  {selectedSubmission.status}
                </span>
                <span className="badge-outline">
                  Runtime: {selectedSubmission.runtime}s
                </span>
                <span className="badge-outline">
                  Memory: {formatMemory(selectedSubmission.memory)}
                </span>
                <span className="badge-outline">
                  Passed: {selectedSubmission.testCasesPassed}/
                  {selectedSubmission.testCasesTotal}
                </span>
              </div>

              {selectedSubmission.errorMessage && (
                <div className="alert alert-error">
                  <div>
                    <span>{selectedSubmission.errorMessage}</span>
                  </div>
                </div>
              )}
            </div>

            <pre className="code-block">
              <code>{selectedSubmission.code}</code>
            </pre>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
};

export default SubmissionHistory;