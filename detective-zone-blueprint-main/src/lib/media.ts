/**
 * Central Media Repository for Detective Zone
 * 
 * - Hero Video: Loaded directly from local assets for instant loading and scrubbing.
 * - All Other Media: Fetched directly from the AWS S3 bucket URLs.
 */

import heroVideoLocal from "@/assets/detective-scrub-fast.mp4";

export const S3_MEDIA = {
  // Hero section video loaded from local assets
  heroVideo: heroVideoLocal,

  // Global & Core Assets fetched from S3
  logo: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/logo.png",
  evidenceRoom: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence-room.jpg",
  noirStreet: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/noir-street.jpg",
  hqScene: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/hq-scene.jpg",
  supportScene: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/support-scene.jpg",
  shortVideo: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/thi_svidoe_make_it_seconds.mp4",

  // About Page Assets from S3
  about: {
    believeCrimeScene: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/about/believe-crime-scene.jpg",
    believeEye: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/about/believe-eye.jpg",
    ctaDesk: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/about/cta-desk.jpg",
    detectiveAlley: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/about/detective-alley.jpg",
    evidenceBoard: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/about/evidence-board.jpg",
  },

  // Case Kits from S3
  caseKits: {
    dz001Kit: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/case_kits/image.png",
  },

  // Case Dossiers from S3
  cases: {
    caseBetrayal: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-betrayal.png",
    caseExperiment: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-experiment.png",
    caseHeir: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-heir.png",
    caseLetter: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-letter.png",
    caseVoicemail: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-voicemail.png",
    caseWitness: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-witness.png",
  },

  // Evidence Files from S3
  evidence: {
    alley: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/alley.jpg",
    corkboard: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/corkboard.jpg",
    e01: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-01.jpg",
    e02: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-02.jpg",
    e03: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-03.jpg",
    e04: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-04.jpg",
    e05: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-05.jpg",
    e06: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-06.jpg",
    e07: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-07.jpg",
    e08: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-08.jpg",
    e09: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-09.jpg",
    e10: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-10.jpg",
    e11: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-11.jpg",
    e12: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-12.jpg",
  },

  // Testimonials from S3
  testimonials: {
    birthday: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/testimonals/testimonial-birthday.jpg",
    couple: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/testimonals/testimonial-couple.jpg",
    family: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/testimonals/testimonial-family.jpg",
    friends: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/testimonals/testimonial-friends.jpg",
  },

  // Signature Evidence Items from S3
  signature: {
    audio: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/signature/audio.png",
    camera: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/signature/camera.png",
    files: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/signature/files.png",
    mobile: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/signature/mobile.png",
    puzzle: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/signature/puzzle.png",
    time: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/signature/time.png",
  },
};

export default S3_MEDIA;
