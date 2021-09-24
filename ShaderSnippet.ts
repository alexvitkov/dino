


export const shadow = `
    float intensity = PreShadowIntensity;

    vec3 uvpos = (sun * vec4(Position, 1)).xyz;
    float dist = distance(uvpos.xyz, vec3(0,0,0));
    uvpos = uvpos / 2.0 + vec3(.5, .5, .5);

    if (dist < 1.0) {
        float other_z = texture(shadowmap, uvpos.xy).r;
        
        float zz = uvpos.z - other_z;
        if (zz > 0.01)
            intensity *= shadowColor.w;
    }
`;


export const blend = `
    out_color = (intensity * diffuse + (1.0 - intensity) * diffuse * vec4(shadowColor.xyz, 1)) * vec4(sunlightColor.xyz, 1) * sunlightColor.w;
`;
