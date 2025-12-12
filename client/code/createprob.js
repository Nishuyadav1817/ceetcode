import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from './axiosClient';
import { useNavigate } from 'react-router';


// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function Createproblem() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/createproblem', data); 
      alert('Problem created successfully!');
      
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Create New Problem</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        {/* Basic Information */}
        <div className="card">
          <h2 className="subheading">Basic Information</h2>
          <div className="section">
            <div className="form-control">
              <label>Title</label>
              <input {...register('title')} className={errors.title ? 'input-error' : ''} />
              {errors.title && <span className="error">{errors.title.message}</span>}
            </div>

            <div className="form-control">
              <label>Description</label>
              <textarea {...register('description')} className={errors.description ? 'textarea-error' : ''} />
              {errors.description && <span className="error">{errors.description.message}</span>}
            </div>

            <div className="flex">
              <div className="form-control">
                <label>Difficulty</label>
                <select {...register('difficulty')} className={errors.difficulty ? 'select-error' : ''}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-control">
                <label>Tag</label>
                <select {...register('tags')} className={errors.tags ? 'select-error' : ''}>
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Test Cases */}
        <div className="card">
          <h2 className="subheading">Test Cases</h2>
          
          {/* Visible Test Cases */}
          <div className="testcases">
            <div className="header">
              <h3>Visible Test Cases</h3>
              <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })}>
                Add Visible Case
              </button>
            </div>
            
            {visibleFields.map((field, index) => (
              <div key={field.id} className="testcase">
                <div className="remove-btn">
                  <button type="button" onClick={() => removeVisible(index)}>Remove</button>
                </div>
                <input {...register(`visibleTestCases.${index}.input`)} placeholder="Input" />
                <input {...register(`visibleTestCases.${index}.output`)} placeholder="Output" />
                <textarea {...register(`visibleTestCases.${index}.explanation`)} placeholder="Explanation" />
              </div>
            ))}
          </div>

          {/* Hidden Test Cases */}
          <div className="testcases">
            <div className="header">
              <h3>Hidden Test Cases</h3>
              <button type="button" onClick={() => appendHidden({ input: '', output: '' })}>
                Add Hidden Case
              </button>
            </div>
            
            {hiddenFields.map((field, index) => (
              <div key={field.id} className="testcase">
                <div className="remove-btn">
                  <button type="button" onClick={() => removeHidden(index)}>Remove</button>
                </div>
                <input {...register(`hiddenTestCases.${index}.input`)} placeholder="Input" />
                <input {...register(`hiddenTestCases.${index}.output`)} placeholder="Output" />
              </div>
            ))}
          </div>
        </div>

        {/* Code Templates */}
        <div className="card">
          <h2 className="subheading">Code Templates</h2>
          
          {[0, 1, 2].map((index) => (
            <div key={index} className="code-template">
              <h3>{index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}</h3>
              
              <div className="form-control">
                <label>Initial Code</label>
                <pre>
                  <textarea {...register(`startCode.${index}.initialCode`)} rows={6} />
                </pre>
              </div>
              
              <div className="form-control">
                <label>Reference Solution</label>
                <pre>
                  <textarea {...register(`referenceSolution.${index}.completeCode`)} rows={6} />
                </pre>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="submit-btn">Create Problem</button>
      </form>
    </div>
  );
}

export default Createproblem;
