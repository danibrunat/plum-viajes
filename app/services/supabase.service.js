export const SupabaseService = {
  getPublicUrlPath: (storageBucket, imageName) => {
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${storageBucket}/${imageName}`;

    return publicUrl;
  },
};
