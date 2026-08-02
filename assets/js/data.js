/* Shared browser storage for the public page and the local admin dashboard. */
window.LBHData = (() => {
  const settingsKey = 'lbh-settings-v1';
  const reviewsKey = 'lakshmi-boys-hostel-reviews';
  const defaults = {
    rent: 4500, availableBeds: 12, totalBeds: 24,
    menu: [
      ['Monday', 'Idli & sambar', 'Rice, dal & vegetable curry', 'Chapati & curry'],
      ['Tuesday', 'Dosa & chutney', 'Rice, sambar & vegetables', 'Rice & curry'],
      ['Wednesday', 'Upma & chutney', 'Rice, dal & vegetable curry', 'Chapati & dal'],
      ['Thursday', 'Idli & chutney', 'Rice, sambar & vegetables', 'Rice & curry'],
      ['Friday', 'Dosa & sambar', 'Rice, dal & vegetable curry', 'Chapati & curry'],
      ['Saturday', 'Upma & chutney', 'Rice, sambar & vegetables', 'Rice & curry'],
      ['Sunday', 'Breakfast special', 'Rice, dal & vegetable curry', 'Chapati & curry']
    ]
  };
  const getSettings = () => { try { return { ...defaults, ...JSON.parse(localStorage.getItem(settingsKey) || '{}') }; } catch { return { ...defaults }; } };
  const saveSettings = settings => localStorage.setItem(settingsKey, JSON.stringify(settings));
  const getReviews = () => { try { return JSON.parse(localStorage.getItem(reviewsKey) || '[]'); } catch { return []; } };
  const saveReviews = reviews => localStorage.setItem(reviewsKey, JSON.stringify(reviews));
  return { getSettings, saveSettings, getReviews, saveReviews, settingsKey, reviewsKey };
})();
