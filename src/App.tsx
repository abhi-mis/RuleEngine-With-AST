import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Rule } from './types/Rule';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// ... rest of the file remains the same