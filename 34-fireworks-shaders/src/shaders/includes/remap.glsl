float inverseLerp(float a, float b, float v) {
  return (v - a) / (b - a);
}

float remap(float v, float oMin, float oMax, float dMin, float dMax) {
  return mix(dMin, dMax, inverseLerp(oMin, oMax, v));
}