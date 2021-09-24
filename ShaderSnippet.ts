


export const shadow = `
    float intensity = PreShadowIntensity;

    vec3 uvpos = (sun * vec4(Position, 1)).xyz;
    float dist = distance(uvpos.xyz, vec3(0,0,0));
    uvpos = uvpos / 2.0 + vec3(.5, .5, .5);

    if (dist < 1.0) {
        float other_z = texture(shadowmap, uvpos.xy).r;
        
        float zz = uvpos.z - other_z;
        if (zz > 0.01)
            intensity *= 0.5;
    }
`;
