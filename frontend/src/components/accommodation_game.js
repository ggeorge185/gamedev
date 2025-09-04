// Accommodation Game Logic
// This module contains the core game logic for the accommodation hunting game

export class AccommodationGame {
  constructor(accommodations, difficulty = 'A1') {
    this.accommodations = accommodations;
    this.difficulty = difficulty;
    this.currentIndex = 0;
    this.score = 0;
    this.totalQuestions = accommodations.length;
    this.gameHistory = [];
  }

  // Get the current accommodation
  getCurrentAccommodation() {
    if (this.currentIndex >= this.accommodations.length) {
      return null;
    }
    return this.accommodations[this.currentIndex];
  }

  // Make a decision about the current accommodation
  makeDecision(userChoice) {
    const accommodation = this.getCurrentAccommodation();
    if (!accommodation) {
      throw new Error('No accommodation available');
    }

    const isCorrect = userChoice !== accommodation.isScam;
    const result = {
      accommodation,
      userChoice,
      isCorrect,
      actualIsScam: accommodation.isScam,
      explanation: this.getExplanation(accommodation, isCorrect),
      score: isCorrect ? 1 : 0
    };

    this.gameHistory.push(result);
    this.score += result.score;
    this.currentIndex++;

    return result;
  }

  // Get explanation for the decision
  getExplanation(accommodation, isCorrect) {
    if (accommodation.isScam) {
      return {
        type: 'scam',
        message: 'This was a scam!',
        flags: accommodation.redFlags || [],
        tips: this.getScamTips()
      };
    } else {
      return {
        type: 'legitimate',
        message: 'This was a legitimate offer!',
        flags: accommodation.greenFlags || [],
        tips: this.getLegitTips()
      };
    }
  }

  // Get tips for identifying scams
  getScamTips() {
    const tips = [
      'Be wary of unusually low prices for the area',
      'Watch out for poor grammar or spelling in listings',
      'Avoid landlords who refuse to meet in person',
      'Be suspicious of requests for money before viewing',
      'Check if photos look too professional or stock-like'
    ];
    
    // Adjust tips based on difficulty
    switch (this.difficulty) {
      case 'A1':
        return tips.slice(0, 2);
      case 'A2':
        return tips.slice(0, 3);
      case 'B1':
        return tips.slice(0, 4);
      case 'B2':
      default:
        return tips;
    }
  }

  // Get tips for identifying legitimate offers
  getLegitTips() {
    const tips = [
      'Realistic pricing for the area and amenities',
      'Professional communication and proper grammar',
      'Willingness to arrange viewings',
      'Detailed and accurate property descriptions',
      'Proper contact information and references'
    ];

    // Adjust tips based on difficulty
    switch (this.difficulty) {
      case 'A1':
        return tips.slice(0, 2);
      case 'A2':
        return tips.slice(0, 3);
      case 'B1':
        return tips.slice(0, 4);
      case 'B2':
      default:
        return tips;
    }
  }

  // Check if game is complete
  isGameComplete() {
    return this.currentIndex >= this.accommodations.length;
  }

  // Get final score and statistics
  getFinalScore() {
    return {
      score: this.score,
      total: this.totalQuestions,
      percentage: Math.round((this.score / this.totalQuestions) * 100),
      rating: this.getPerformanceRating(),
      history: this.gameHistory
    };
  }

  // Get performance rating based on score
  getPerformanceRating() {
    const percentage = (this.score / this.totalQuestions) * 100;
    
    if (percentage >= 90) return 'Expert';
    if (percentage >= 80) return 'Advanced';
    if (percentage >= 70) return 'Intermediate';
    if (percentage >= 60) return 'Beginner';
    return 'Novice';
  }

  // Reset the game
  reset() {
    this.currentIndex = 0;
    this.score = 0;
    this.gameHistory = [];
    // Shuffle accommodations for variety
    this.accommodations = [...this.accommodations].sort(() => Math.random() - 0.5);
  }
}

export default AccommodationGame;