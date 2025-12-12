import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "./axiosClient";
import { User } from "lucide-react";
import { useSelector } from 'react-redux';
import SubmissionHistory from './subhis'
const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript'
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let { problemId } = useParams();
  const { handleSubmit } = useForm();

  const {user}=useSelector((state) => state.auth)
 useEffect(() => {
  
  const fetchProblem = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/problem/getproblem/${[problemId]}`);
      const problemData = response.data;
      console.log('Fetched problem:', problemData);

setProblem(problemData.problem || problemData);
      

      const startCodeEntry = problemData.startCode?.find(
        sc => sc.language === langMap[selectedLanguage]
      );
      if (startCodeEntry) {
        setCode(startCodeEntry.initialCode);
      } else {
        setCode('');
      }
    } catch (error) {
     const err=error
    } finally {
      setLoading(false);
    }
  };

  fetchProblem();
}, [problemId]);


 useEffect(() => {
  if (problem && Array.isArray(problem.startCode)) {
    const match = problem.startCode.find(
      sc => sc.language === langMap[selectedLanguage]
    );

    if (match && match.initialCode) {
      setCode(match.initialCode);
    }
  }
}, [problem, selectedLanguage]);

  const handleEditorChange = (value) => setCode(value || '');
  const handleEditorDidMount = (editor) => (editorRef.current = editor);
  const handleLanguageChange = (language) => setSelectedLanguage(language);

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submit/run/${problemId}`, {
        code,
        language: selectedLanguage
      });
      setRunResult(response.data);
      setActiveRightTab('testcase');
    } catch (error) {
        const err=error;
      setRunResult({ success: false, error: 'Internal server error' });
      setActiveRightTab('testcase');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submit/submitproblem/${problemId}`, {
        code,
        language: selectedLanguage
      });
      setSubmitResult(response.data);
      setActiveRightTab('result');
    } catch (error) {
       const err=error;
      setSubmitResult(null);
      setActiveRightTab('result');
    } finally {
      setLoading(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'easy';
      case 'medium': return 'medium';
      case 'hard': return 'hard';
      default: return 'default';
    }
  };

if (!problem) {
  return <div className="loading-container"><span className="spinner"></span></div>;
}

  return (

    <div>

        <nav className="hp-navbar">
        <div className="hp-logo">
          <h2>Ceetcode</h2>
        </div>
          <h3> <User size={24} className="cursor-pointer " title="Admin" />  {user.firstName}</h3>
    </nav>
    
    <div className="problem-page">
      {/* Left Panel */}
      <div className="left-panel">
        {/* Tabs */}
        <div className="left-tabs">
          {['description', 'editorial', 'solutions', 'submissions'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeLeftTab === tab ? 'active' : ''}`}
              onClick={() => setActiveLeftTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="left-content">
          {problem && (
            <>
              {activeLeftTab === 'description' && (
                <div className="problem-header-box">
                  <div className="problem-header">
                    <h1 className="problem-title">{problem?.title}</h1>
                    <div className={`badge difficulty-${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </div>
                    <div className="badge tag-badge">{problem.tags}</div>
                  </div>
                  <div className="problem-description">{problem.description}</div>
                  <div className="examples-section">
                    <h3>Examples:</h3>
                 {problem?.visibleTestCases?.length > 0 ? (
  problem.visibleTestCases.map((example, i) => (
    <div key={i} className="example-card">
      <h4>Example {i + 1}</h4>
      <p><strong>Input:</strong> {example.input}</p>
      <p><strong>Output:</strong> {example.output}</p>
      <p><strong>Explanation:</strong> {example.explanation}</p>
    </div>
  ))
) : (
  <p>No examples available.</p>
)}
                  </div>
                </div>
              )}

              {activeLeftTab === 'editorial' && (
                <div className="editorial">
                  <h2>Editorial</h2>
                  <p>Editorial is here for the problem</p>
                </div>
              )}

              {activeLeftTab === 'solutions' && (
                <div className="solutions">
                  <h2>Solutions</h2>
                  {problem.referenceSolution?.map((solution, i) => (
                    <div key={i} className="solution-card">
                      <div className="solution-header">
                        {problem.title} - {solution.language}
                      </div>
                      <pre className="solution-code">
                        <code>{solution.completeCode}</code>
                      </pre>
                    </div>
                  )) || <p>Solutions will be available after you solve the problem.</p>}
                </div>
              )}

              {activeLeftTab === 'submissions' && (
                <div className="submissions">
                  <h2>My Submissions</h2>
                  <div>
                    <SubmissionHistory problemId={problemId} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        {/* Tabs */}
        <div className="right-tabs">
          {['code', 'testcase', 'result'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeRightTab === tab ? 'active' : ''}`}
              onClick={() => setActiveRightTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Code Editor */}
        {activeRightTab === 'code' && (
          <div className="code-section">
            <div className="language-buttons">
              {['javascript', 'java', 'cpp'].map((lang) => (
                <button
                  key={lang}
                  className={`lang-btn ${selectedLanguage === lang ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(lang)}
                >
                  {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                </button>
              ))}
            </div>

            <div className="editor-container">
              <Editor
                height="100%"
                language={getLanguageForMonaco(selectedLanguage)}
                value={code}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  folding: true,
                  cursorStyle: 'line',
                  mouseWheelZoom: true
                }}
              />
            </div>

            <div className="action-buttons">
              <button onClick={() => setActiveRightTab('testcase')}>Console</button>
              <div>
                <button onClick={handleRun} disabled={loading}>
                  {loading ? 'Running...' : 'Run'}
                </button>
                <button onClick={handleSubmitCode} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeRightTab === 'testcase' && (
  <div className="testcase-section">
    <h3>Test Results</h3>

    {runResult ? (
      <div
        className={`result-card ${
          runResult.message === 'Accepted' ? 'accepted' : 'rejected'
        }`}
      >
        <p>
          <strong>Status:</strong> {runResult.message}
        </p>
        <p>
          <strong>Expected Output:</strong> {runResult.expected_output}
        </p>
        <p>
          <strong>Actual Output:</strong> {runResult.actual_output}
        </p>
      </div>
    ) : (
      <p>Click "Run" to test your code with the example test cases.</p>
    )}
  </div>
)}
        

        {activeRightTab === 'result' && (
          <div className="result-section">
        {submitResult ? (
  <div
    className={`submission-message ${
      submitResult === "code submitted successfully" ? "success-bg" : ""
    }`}
  >
    <pre>{JSON.stringify(submitResult, null, 2)}</pre>
  </div>
) : (
  <p>Click "Submit" to submit your solution for evaluation.</p>
)}
          </div>
        )}
      </div>
    </div></div>
  );
};

export default ProblemPage;
