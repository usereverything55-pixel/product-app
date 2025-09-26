import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const MultiStepForm = ({ company }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formSteps, setFormSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState('');
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {
    fetchFormSteps();
  }, []);

  const fetchFormSteps = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/form-steps');
      setFormSteps(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching form steps:', error);
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3001/api/products', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSubmitStatus('success');
      // Reset form after success
      setTimeout(() => {
        setSubmitStatus('');
        setCurrentStep(0);
        window.location.reload(); // Simple way to reset form
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  const nextStep = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Loading form...</h3>
          <p>Please wait while we load the product form.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Progress Bar */}
      <div className="progress-bar">
        {formSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`progress-step ${
              index < currentStep ? 'completed' : 
              index === currentStep ? 'active' : ''
            }`}>
              {index + 1}
            </div>
            {index < formSteps.length - 1 && (
              <div className={`progress-line ${
                index < currentStep ? 'active' : ''
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Content */}
      {formSteps[currentStep] && (
        <div>
          <h2 style={{ marginBottom: '10px', color: '#1f2937' }}>
            Step {currentStep + 1}: {formSteps[currentStep].title}
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '30px' }}>
            {formSteps[currentStep].description}
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {formSteps[currentStep].questions.map((question) => (
              <div key={question.id} className="form-group">
                <label>
                  {question.questionText}
                  {question.isRequired && <span style={{ color: '#ef4444' }}> *</span>}
                </label>
                
                {question.type === 'text' && (
                  <input
                    type="text"
                    {...register(question.fieldName, { 
                      required: question.isRequired ? 'This field is required' : false 
                    })}
                    placeholder={question.placeholder}
                    disabled={submitStatus === 'success'}
                  />
                )}

                {question.type === 'textarea' && (
                  <textarea
                    rows={4}
                    {...register(question.fieldName)}
                    placeholder={question.placeholder}
                    disabled={submitStatus === 'success'}
                  />
                )}

                {question.type === 'select' && (
                  <select 
                    {...register(question.fieldName, { 
                      required: question.isRequired ? 'Please select an option' : false 
                    })}
                    disabled={submitStatus === 'success'}
                  >
                    <option value="">Select an option</option>
                    {question.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                )}

                {question.type === 'number' && (
                  <input
                    type="number"
                    step="0.01"
                    {...register(question.fieldName, { 
                      required: question.isRequired ? 'This field is required' : false,
                      valueAsNumber: true 
                    })}
                    placeholder={question.placeholder}
                    disabled={submitStatus === 'success'}
                  />
                )}

                {question.type === 'radio' && (
                  <div>
                    {question.options.map(option => (
                      <label key={option} style={{ display: 'block', margin: '8px 0' }}>
                        <input
                          type="radio"
                          value={option}
                          {...register(question.fieldName)}
                          disabled={submitStatus === 'success'}
                          style={{ marginRight: '10px' }}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}

                {errors[question.fieldName] && (
                  <span style={{ color: '#ef4444', fontSize: '14px', display: 'block', marginTop: '5px' }}>
                    {errors[question.fieldName].message}
                  </span>
                )}
              </div>
            ))}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0 || submitStatus === 'success'}
                className="btn btn-secondary"
              >
                ← Previous
              </button>

              {currentStep < formSteps.length - 1 ? (
                <button 
                  type="button" 
                  onClick={nextStep} 
                  className="btn btn-primary"
                  disabled={submitStatus === 'success'}
                >
                  Next →
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={submitStatus === 'success'}
                >
                  {submitStatus === 'success' ? '✅ Submitted!' : '🚀 Submit Product'}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Submission Status */}
      {submitStatus === 'success' && (
        <div className="alert alert-success">
          <h4>🎉 Success!</h4>
          <p>Your product has been submitted successfully! You can view it in the "My Products" tab.</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="alert alert-error">
          <h4>❌ Error</h4>
          <p>There was an error submitting your product. Please try again.</p>
        </div>
      )}

      {/* Step Indicator */}
      <div style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280' }}>
        Step {currentStep + 1} of {formSteps.length}
      </div>
    </div>
  );
};

export default MultiStepForm;